import NextTopLoader from "nextjs-toploader";

export default function TopProgresBar() {
  return (
    <NextTopLoader
    color="#7743DB"
    initialPosition={0.08}
    crawlSpeed={200}
    height={4}
    crawl={true}
    showSpinner={true}
    easing="ease"
    speed={200}
    shadow="0 0 10px #2299DD,0 0 20px #2299DD"
  />
  );
}