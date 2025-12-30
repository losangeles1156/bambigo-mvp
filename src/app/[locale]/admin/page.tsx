import { redirect } from 'next/navigation';

export default function AdminIndexPage({ params: { locale } }: { params: { locale: string } }) {
    redirect(`/${locale}/admin/security`);
}

