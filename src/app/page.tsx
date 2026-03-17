import { redirect } from 'next/navigation';

export default async function Home() {
  if (true) {
    redirect('/dashboard');
  }
}
