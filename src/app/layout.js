import './globals.css'

export const metadata = {
  title: 'Vioniko',
  description: 'Desbloquea el poder de la',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className='overflow-x-hidden'>{children}</body>
    </html>
  )
}
