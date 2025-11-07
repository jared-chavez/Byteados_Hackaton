import { useEffect, useRef, useState } from 'react';

const imageCache = new Set();
const defaultPlaceholder =
    'data:image/gif;base64,R0lGODlhAQABAAAAACw=';

const LazyImage = ({
    src,
    alt,
    className = '',
    placeholder = defaultPlaceholder,
    rootMargin = '150px',
    onLoad: onLoadProp,
    ...rest
}) => {
    const imgRef = useRef(null);
    const [currentSrc, setCurrentSrc] = useState(
        imageCache.has(src) ? src : placeholder,
    );

    useEffect(() => {
        const node = imgRef.current;

        if (!node) {
            return undefined;
        }

        if (imageCache.has(src)) {
            setCurrentSrc(src);
            return undefined;
        }

        if (!('IntersectionObserver' in window)) {
            setCurrentSrc(src);
            return undefined;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setCurrentSrc(src);
                        observer.unobserve(node);
                    }
                });
            },
            { rootMargin },
        );

        observer.observe(node);

        return () => observer.disconnect();
    }, [rootMargin, src]);

    const handleLoad = (event) => {
        imageCache.add(src);
        if (typeof onLoadProp === 'function') {
            onLoadProp(event);
        }
    };

    return (
        <img
            ref={imgRef}
            src={currentSrc}
            data-src={src}
            alt={alt}
            className={className}
            loading="lazy"
            decoding="async"
            onLoad={handleLoad}
            {...rest}
        />
    );
};

export default LazyImage;

