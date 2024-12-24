import Image from "next/image";

interface ProductViewProps {
    title: string,
    price: number
}

export default function ProductView(props: ProductViewProps) {
    const width = 325;
    const height = 400;

    const logoWidth = 75;
    const logoHeight = 50;

    /*
    layout is 
    [IMAGE]
    [BRAND LOGO]
    [BRAND TITLE]
    [PRICE]
    [EXTRA IF APPLICABLE] 
    */

    return <>
        <div className="flex flex-col bg-purple-600 max-w-fit">
            <Image src={`https://placehold.co/${width}x${height}`} alt="ProductImage"
                width={width} height={height} />
            <Image src={`https://placehold.co/${logoWidth}x${logoHeight}`}
                className="mr-auto ml-auto mt-4 mb-2"
                alt="ProductBrandLogo"
                width={logoWidth} height={logoHeight} />
            <span className="text-center mb-1">{props.title}</span>
            <p className="text-center">${props.price}</p>
        </div>
    </>
}