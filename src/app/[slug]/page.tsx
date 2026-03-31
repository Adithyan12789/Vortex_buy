import Add from "@/components/Add";
import CustomizeProducts from "@/components/CustomizeProducts";
import ProductImages from "@/components/ProductImages";
import ProductList from "@/components/ProductList";
import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";

const SinglePage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/product/${slug}`);
        setProduct(res.data);
      } catch (error) {
        console.error("Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product Not Found</div>;

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-32 relative flex flex-col gap-16 mt-12 mb-24">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* IMAGES */}
        <div className="w-full lg:w-1/2 lg:sticky top-20 h-max">
          <ProductImages items={product.media?.items} />
        </div>

        {/* TEXTS */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <h1 className="text-4xl font-medium">{product.name}</h1>
          <p className="text-gray-500">{product.description}</p>

          <div className="h-[2px] bg-gray-100" />

          {product.price?.price === product.price?.discountedPrice ? (
            <h2 className="font-medium text-2xl">₹{product.price?.price}</h2>
          ) : (
            <div className="flex items-center gap-4">
              <h3 className="text-xl text-gray-500 line-through">
                {product.price?.price}
              </h3>
              <h3 className="font-medium text-2xl">
                {product.price?.discountedPrice}
              </h3>
            </div>
          )}

          <div className="h-[2px] bg-gray-100" />

          {product.variants && product.productOptions ? (
            <CustomizeProducts
              productId={product._id!}
              variants={product.variants}
              productOptions={product.productOptions}
            />
          ) : (
            <Add 
              productId={product._id || "unknown-id"} 
              variantId="00000000-0000-0000-0000-000000000000" 
              stockNumber={product.stock?.quantity || 0}
            />
          )}

          <div className="h-[2px] bg-gray-100" />

          {product.additionalInfoSections?.map((section: any) => (
            <div className="text-sm" key={section.title}>
              <h4 className="font-medium mb-4">{section.title}</h4>
              <p>{section.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      <div className="mt-24">
        <h1 className="text-2xl font-medium mb-8">Related Products</h1>
        <ProductList 
          categoryId={product.categorySlug} 
          limit={4} 
          hidePagination={true}
          excludeId={product._id}
        />
      </div>
    </div>
  );
};

export default SinglePage;
