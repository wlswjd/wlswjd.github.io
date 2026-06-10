export interface Category {
  id: string
  label: string
  path: string[]
  children?: Category[]
}

export const CATEGORY_TREE: Category[] = [
  {
    id: 'study',
    label: 'STUDY',
    path: ['study'],
    children: [
      { id: 'ml', label: '머신러닝 (ML)', path: ['study', 'ml'] },
      { id: 'dl', label: '딥러닝 (DL)', path: ['study', 'dl'] },
      { id: 'llm-agent', label: 'LLM Agent', path: ['study', 'llm-agent'] },
      { id: 'code', label: '코딩 (CODE)', path: ['study', 'code'] },
      { id: 'papers', label: '논문 (Papers)', path: ['study', 'papers'] },
    ],
  },
  {
    id: 'project',
    label: 'PROJECT',
    path: ['project'],
    children: [
      { id: 'competition', label: '경진대회 (Competition)', path: ['project', 'competition'] },
      { id: 'game-qa', label: 'Game QA', path: ['project', 'game-qa'] },
      { id: 'side-project', label: '사이드프로젝트 (SideProject)', path: ['project', 'side-project'] },
    ],
  },
  {
    id: 'daily',
    label: 'DAILY',
    path: ['daily'],
    children: [
      { id: 'life', label: '일상 (Life)', path: ['daily', 'life'] },
      { id: 'books', label: '독서 (Books)', path: ['daily', 'books'] },
      { id: 'retrospective', label: '회고 (Retrospective)', path: ['daily', 'retrospective'] },
    ],
  },
]

export function getCategoryByPath(pathArr: string[]): Category | null {
  const target = pathArr.join('/')
  for (const root of CATEGORY_TREE) {
    if (root.path.join('/') === target) return root
    for (const child of root.children ?? []) {
      if (child.path.join('/') === target) return child
    }
  }
  return null
}

export function getCategoryLabel(pathArr: string[]): string {
  const cat = getCategoryByPath(pathArr)
  if (cat) return cat.label
  return pathArr[pathArr.length - 1] ?? ''
}
