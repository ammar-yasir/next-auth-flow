import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getUserAccounts() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  return await prisma.account.findMany({
    where: {
      userId: session.user.id,
    },
  });
}

export async function disconnectAccount(provider: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return false;
  }

  try {
    await prisma.account.deleteMany({
      where: {
        userId: session.user.id,
        provider,
      },
    });
    return true;
  } catch (error) {
    console.error("Failed to disconnect account:", error);
    return false;
  }
}

export async function getConnectedProviders() {
  const accounts = await getUserAccounts();

  if (!accounts) {
    return [];
  }

  return accounts.map((account: { provider: string }) => account.provider);
}
