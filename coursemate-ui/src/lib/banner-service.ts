import { fileService } from './file-service'

export interface BannerItem {
  id: string
  fileId: string
  imageUrl: string
  title: string
  link: string
  order: number
}

const STORAGE_KEY = 'coursemate_banners'

function load(): BannerItem[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

function save(items: BannerItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export const bannerService = {
  list(): BannerItem[] {
    return load().sort((a, b) => a.order - b.order)
  },

  async upload(file: File, title: string, link: string): Promise<BannerItem> {
    const res = await fileService.uploadFile(file)
    const imageUrl = fileService.getDownloadUrl(res.fileId)
    const items = load()
    const item: BannerItem = {
      id: res.fileId,
      fileId: res.fileId,
      imageUrl,
      title,
      link,
      order: items.length
    }
    save([...items, item])
    return item
  },

  async remove(id: string): Promise<void> {
    const items = load()
    const item = items.find(i => i.id === id)
    if (item) {
      try {
        await fileService.deleteFile(item.fileId)
      } catch {}
    }
    save(items.filter(i => i.id !== id))
  },

  reorder(ids: string[]): void {
    const items = load()
    const map = new Map(items.map(i => [i.id, i]))
    const reordered = ids.map((id, idx) => ({ ...map.get(id)!, order: idx }))
    save(reordered)
  },

  update(id: string, patch: Partial<Pick<BannerItem, 'title' | 'link'>>): void {
    const items = load()
    save(items.map(i => (i.id === id ? { ...i, ...patch } : i)))
  }
}
