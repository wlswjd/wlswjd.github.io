'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CATEGORY_TREE, type Category } from '@/lib/categories'

interface TagInfo {
  tag: string
  count: number
}

interface Props {
  tags: TagInfo[]
}

function LeafNode({ category }: { category: Category }) {
  const pathname = usePathname()
  const href = `/category/${category.path.join('/')}`
  const isActive = pathname === href

  return (
    <div className={`tree-leaf-item ${isActive ? 'active' : ''}`}>
      <span className="leaf-line">└─</span>
      <Link href={href} className="tree-link">
        {category.label}
      </Link>
    </div>
  )
}

function RootNode({ category }: { category: Category }) {
  const [isOpen, setIsOpen] = useState(true)
  const pathname = usePathname()
  const href = `/category/${category.path.join('/')}`
  const isActive = pathname.startsWith(href)

  return (
    <div className="tree-root-node">
      <div
        className={`tree-root-item ${isActive ? 'active' : ''}`}
        onClick={() => setIsOpen(o => !o)}
      >
        <span className="toggle-box">{isOpen ? '-' : '+'}</span>
        <Link
          href={href}
          className="tree-link root-link"
          onClick={e => e.stopPropagation()}
        >
          {category.label}
        </Link>
      </div>
      {isOpen && category.children && (
        <div className="tree-children">
          {category.children.map(child => (
            <LeafNode key={child.id} category={child} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function Sidebar({ tags }: Props) {
  const [rootOpen, setRootOpen] = useState(true)
  const [tagsOpen, setTagsOpen] = useState(true)

  return (
    <aside className="sidebar">
      <div className="nes-container sidebar-inner">
        <div className="sidebar-title">
          <span className="nes-icon is-small star"></span>
          <span>MENU</span>
        </div>

        {/* Category Tree */}
        <div className="tree-wrapper">
          <div
            className="tree-categories-header"
            onClick={() => setRootOpen(o => !o)}
          >
            <span className="toggle-box">{rootOpen ? '-' : '+'}</span>
            <span className="categories-label">Categories</span>
          </div>
          {rootOpen && (
            <div className="tree-top-children">
              {CATEGORY_TREE.map(cat => (
                <RootNode key={cat.id} category={cat} />
              ))}
            </div>
          )}
        </div>

        {/* Tag Cloud */}
        {tags.length > 0 && (
          <div className="sidebar-section">
            <div
              className="tree-categories-header"
              onClick={() => setTagsOpen(o => !o)}
            >
              <span className="toggle-box">{tagsOpen ? '-' : '+'}</span>
              <span className="categories-label">Tags</span>
            </div>
            {tagsOpen && (
              <div className="tag-cloud">
                {tags.slice(0, 11).map(({ tag, count }) => (
                  <Link
                    key={tag}
                    href={`/tag/${encodeURIComponent(tag)}`}
                    className="tag-cloud-item has-tooltip"
                    data-tooltip={`${count}개의 포스트`}
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* GitHub 잔디 */}
        <div className="sidebar-section">
          <div className="sidebar-section-title">GitHub</div>
          <div className="github-chart-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://github-readme-activity-graph.vercel.app/graph?username=wlswjd&theme=minimal&hide_border=true&area=true&height=150"
              alt="GitHub contributions"
              className="github-chart"
            />
          </div>
        </div>

        {/* Contact */}
        <div className="sidebar-section">
          <div className="sidebar-section-title">Contact</div>
          <div className="contact-icons">
            <a
              href="https://github.com/wlswjd"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-icon-link has-tooltip"
              data-tooltip="GitHub"
            >
              <i className="nes-icon github is-medium"></i>
            </a>
            <a
              href="mailto:wlswjd010629@gmail.com"
              className="contact-icon-link has-tooltip"
              data-tooltip="Gmail"
            >
              <i className="nes-icon gmail is-medium"></i>
            </a>
          </div>
        </div>
      </div>
    </aside>
  )
}
