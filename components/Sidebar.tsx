'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CATEGORY_TREE, type Category } from '@/lib/categories'

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

export default function Sidebar() {
  const [rootOpen, setRootOpen] = useState(true)

  return (
    <aside className="sidebar">
      <div className="nes-container sidebar-inner">
        <div className="sidebar-title">
          <span className="nes-icon is-small star"></span>
          <span>MENU</span>
        </div>
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
      </div>
    </aside>
  )
}
