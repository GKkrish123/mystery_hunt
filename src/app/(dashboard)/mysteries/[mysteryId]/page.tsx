// app/mystery/[mysteryId]/page.tsx
import { notFound } from 'next/navigation';

interface MysteryPageProps {
  params: {
    mysteryId: string;
  };
}

// Simulate fetching mystery data by ID (could be from a DB or API)
async function getMysteryById(mysteryId: string) {
  // Example mock data; replace this with your actual data fetching logic
  const mockMysteries = [
    { id: '1', title: 'The Vanishing Act', description: 'A mystery of a missing person.' },
    { id: '2', title: 'The Cursed Amulet', description: 'An ancient relic with dangerous powers.' },
  ];

  return mockMysteries.find((mystery) => mystery.id === mysteryId) || null;
}

export default async function MysteryPage({ params }: MysteryPageProps) {
  const { mysteryId } = params;  

  // Fetch the mystery based on the ID
  const mystery = await getMysteryById(mysteryId);

  // Handle not found case
  if (!mystery) {
    notFound(); // Redirect to a 404 page if the mystery is not found
  }

  return (
    <div>
      <h1>{mystery.title}</h1>
      <p>{mystery.description}</p>
    </div>
  );
}
