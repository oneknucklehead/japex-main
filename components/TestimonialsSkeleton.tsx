// components/TestimonialsSkeleton.tsx
import Container from "@/components/Container";

export default function TestimonialsSkeleton() {
  return (
    <div className="relative overflow-hidden">
      <Container>
        <div className="text-white flex flex-col justify-center items-center py-10 sm:py-14 md:py-16 px-4 sm:px-5 md:px-6">
          {/* heading placeholders */}
          <div className="h-6 w-40 rounded-full bg-white/5 animate-pulse" />
          <div className="mt-4 h-8 w-full max-w-lg rounded-lg bg-white/5 animate-pulse" />
          <div className="mt-3 h-4 w-full max-w-md rounded bg-white/5 animate-pulse" />

          {/* rating card placeholder */}
          <div className="mt-6 h-20 w-72 rounded-2xl bg-white/5 animate-pulse" />

          {/* carousel placeholder */}
          <div className="mt-8 grid w-full max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-56 rounded-2xl border border-white/10 bg-white/5 animate-pulse"
              />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
