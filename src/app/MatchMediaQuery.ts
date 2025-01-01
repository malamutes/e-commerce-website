import { useEffect, useState } from "react";

interface UseMatchMediaQueryProps {
    size: number;
}


// NEED TO COME BACK TO THIS SINCE IT IS A CUSTOM HOOK

export function useMatchMediaQuery({ size }: UseMatchMediaQueryProps) {
    const [matches, setMatches] = useState<boolean>(window.innerWidth >= size);

    useEffect(() => {
        const mediaQueryList = window.matchMedia(`(min-width: ${size}px)`);

        const handler = () => setMatches(mediaQueryList.matches);
        mediaQueryList.addEventListener("change", handler);

        // Initial check
        handler();

        return () => {
            mediaQueryList.removeEventListener("change", handler);
        };
    }, [size]);

    return matches;
}
