export default function Post({ params }: { params: { id: string } }) {
  return (
    <>
      <h1>Post: {params.id}</h1>
      <a href="/">Home</a>
    </>
  );
}
