import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export const size = {
    width: 32,
    height: 32,
}
export const contentType = 'image/svg+xml'

export default function Icon() {
    const logoPath = join(process.cwd(), 'public/images/lynk-logo.png')
    const logoData = readFileSync(logoPath)
    const base64Logo = logoData.toString('base64')

    const svg = `
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="white" />
      <image href="data:image/png;base64,${base64Logo}" x="4" y="4" width="24" height="24" />
    </svg>
  `.trim()

    return new NextResponse(svg, {
        headers: {
            'Content-Type': 'image/svg+xml',
        },
    })
}
