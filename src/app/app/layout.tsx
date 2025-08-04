import QueryPorivder from "@/providers/QueryProvider";



export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
        <QueryPorivder>
          {children}
        </QueryPorivder>
  );
};
