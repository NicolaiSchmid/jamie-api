import type { TOCItemType } from 'fumadocs-core/toc'
import { useFumadocsLoader } from 'fumadocs-core/source/client'
import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/layouts/docs/page'
import browserCollections from 'fumadocs-mdx:collections/browser'
import { Suspense, type ReactNode } from 'react'
import { ClientAPIPage } from '#/components/api-page'
import { JamieDocsLayout } from './docs-layout'
import { DocsPageContent } from './docs-content'
import { source } from './source'

type SerializedTOCItem = Omit<TOCItemType, 'title'> & {
  title: string
}

type DocsContentProps = {
  description?: string
  title?: string
  toc?: SerializedTOCItem[]
}

export const docsClientLoader = browserCollections.docs.createClientLoader({
  id: 'jamie-docs',
  component(loaded, props: DocsContentProps) {
    return (
      <DocsPageContent
        content={loaded.default}
        description={props.description}
        title={props.title}
        toc={deserializeToc(props.toc)}
      />
    )
  },
})

function deserializeToc(toc?: SerializedTOCItem[]): TOCItemType[] | undefined {
  if (!toc) {
    return undefined
  }

  return toc.map((item) => ({
    ...item,
    title: <span dangerouslySetInnerHTML={{ __html: item.title }} />,
  }))
}

const serverPageLoader = createServerFn({
  method: 'GET',
})
  .inputValidator((slugs: string[]) => slugs)
  .handler(async ({ data: slugs }) => {
    const page = source.getPage(slugs)

    if (!page) {
      throw notFound()
    }

    const pageTree = await source.serializePageTree(source.getPageTree())

    if (page.type === 'openapi') {
      return {
        description: page.data.description,
        pageTree,
        props: await page.data.getClientAPIPageProps(),
        title: page.data.title,
        type: 'openapi' as const,
      }
    }

    const { renderToString } = await import('react-dom/server.edge')

    return {
      description: page.data.description,
      pageTree,
      path: page.path,
      title: page.data.title,
      toc: page.data.toc.map((item) => ({
        ...item,
        title: renderToString(<>{item.title}</>),
      })),
      type: 'docs' as const,
    }
  })

export async function loadDocsPage(slugs: string[]) {
  const data = await serverPageLoader({ data: slugs })

  if (data.type === 'docs') {
    await docsClientLoader.preload(data.path)
  }

  return data
}

export type LoadedDocsPage = Awaited<ReturnType<typeof loadDocsPage>>

export function DocsRoutePage({ data }: { data: LoadedDocsPage }) {
  const page = useFumadocsLoader(data)
  let content: ReactNode

  if (page.type === 'openapi') {
    content = (
      <DocsPage full>
        <DocsTitle>{page.title}</DocsTitle>
        <DocsDescription>{page.description}</DocsDescription>
        <DocsBody>
          <ClientAPIPage {...page.props} />
        </DocsBody>
      </DocsPage>
    )
  } else {
    content = docsClientLoader.useContent(page.path, {
      description: page.description,
      title: page.title,
      toc: page.toc,
    })
  }

  return (
    <JamieDocsLayout tree={page.pageTree}>
      <Suspense>{content}</Suspense>
    </JamieDocsLayout>
  )
}
