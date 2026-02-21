import ChatWidget from "./components/ChatWidget";


export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <ChatWidget businessId="your-test-business-id-from-supabase" />
    </main>
  );
}
