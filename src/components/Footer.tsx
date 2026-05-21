import Link from "next/link"

export function Footer() {
  return (
    <footer className="mt-12 border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-gray-600">
        <div className="mb-4 flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/about" className="hover:text-gray-900">
            데이트립 소개
          </Link>
          <Link href="/faq" className="hover:text-gray-900">
            자주 묻는 질문
          </Link>
          <Link href="/contact" className="hover:text-gray-900">
            문의하기
          </Link>
          <Link href="/privacy" className="hover:text-gray-900">
            개인정보처리방침
          </Link>
          <Link href="/terms" className="hover:text-gray-900">
            이용약관
          </Link>
        </div>
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} 데이트립. Powered by 카카오맵.
        </p>
      </div>
    </footer>
  )
}
