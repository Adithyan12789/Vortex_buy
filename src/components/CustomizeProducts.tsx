
import React, { useEffect, useState } from "react";
import Add from "./Add";

const CustomizeProducts = ({
  productId,
  variants,
  productOptions,
}: {
  productId: string;
  variants: products.Variant[];
  productOptions: products.ProductOption[];
}) => {
  const [selectedOptions, setSelectionOption] = useState<{
    [key: string]: string;
  }>({});

  const [selectedVariant, setSelectedVariant] = useState<products.Variant>();

  useEffect(() => {
    const variant = variants.find((v) => {
      const variantChoices = v.choices;
      if (!variantChoices) return false;
      return Object.entries(selectedOptions).every(
        ([key, value]) => variantChoices[key] === value
      );
    });

    setSelectedVariant(variant);
  }, [selectedOptions, variants]);

  const handleOptionSelect = (optionType: string, choice: string) => {
    setSelectionOption((prev) => ({ ...prev, [optionType]: choice }));
  };

  const isVariantInStock = (choices: { [key: string]: string }) => {
    return variants.some((variant) => {
      const variantChoices = variant.choices;
      if (!variantChoices) return false;

      return (
        Object.entries(choices).every(
          ([key, value]) => variantChoices[key] === value
        ) &&
        variant.stock?.inStock &&
        variant.stock?.quantity &&
        variant.stock?.quantity > 0
      );
    });
  };

  return (
    <div className="flex flex-col gap-10">
      {productOptions.map((option) => (
        <div className="flex flex-col gap-5" key={option.name}>
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            Select {option.name}
          </h4>
          <ul className="flex items-center gap-4 flex-wrap">
            {option.choices?.map((choice) => {
              const disabled = !isVariantInStock({
                ...selectedOptions,
                [option.name!]: choice.description!,
              });

              const selected =
                selectedOptions[option.name!] === choice.description;

              const clickHandler = disabled
                ? undefined
                : () => handleOptionSelect(option.name!, choice.description!);

              return option.name?.toLowerCase() === "color" ? (
                <li
                  key={choice.description}
                  className={`w-12 h-12 rounded-full relative flex items-center justify-center transition-all duration-500 shadow-sm ${
                    disabled ? "cursor-not-allowed opacity-30" : "cursor-pointer hover:scale-110 active:scale-95"
                  }`}
                  onClick={clickHandler}
                >
                   <div 
                    className={`w-10 h-10 rounded-full border border-black/5 shadow-inner transition-transform duration-500 ${selected ? 'scale-110' : ''}`}
                    style={{ backgroundColor: choice.value }}
                  />
                  {selected && (
                    <div className="absolute inset-0 rounded-full ring-2 ring-vortexBuy ring-offset-4 scale-100 animate-fade-in" />
                  )}
                  {disabled && (
                    <div className="absolute w-10 h-[2px] rotate-[135deg] bg-red-500/50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  )}
                </li>
              ) : (
                <li
                  key={choice.description}
                  className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 border ${
                    selected
                      ? "bg-gray-900 text-white border-gray-900 shadow-2xl shadow-black/10 scale-105"
                      : disabled
                      ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed opacity-40"
                      : "bg-white text-gray-500 border-gray-100 hover:border-vortexBuy/40 hover:text-vortexBuy cursor-pointer"
                  }`}
                  onClick={clickHandler}
                >
                  {choice.description}
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      <Add
        productId={productId}
        variantId={selectedVariant?._id || "00000000-0000-0000-0000-000000000000"}
        stockNumber={selectedVariant?.stock?.quantity || 0}
      />
    </div>
  );
};

export default CustomizeProducts;
