import React, { useState } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const ProductCard = ({ product }) => {
  const { addToCart, removeFromCart, cartItems, navigate } = useAppContext();

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const selectedVariant = product.variants[selectedVariantIndex];
  const cartKey = `${product._id}|${selectedVariantIndex}`;

  return product && (
    <div
      onClick={() => {
        navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
        scrollTo(0, 0);
      }}
      className="border border-gray-300 rounded-md md:px-4 px-3 py-2 bg-white w-full cursor-pointer flex flex-col"
    >
      <div className="group flex items-center justify-center w-full h-40 md:h-48 overflow-hidden mb-2">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
          src={product.image[0]}
          alt={product.name}
        />
      </div>

      <div className="text-gray-500/60 text-sm flex flex-col flex-1 w-full">
        <p>{product.category}</p>
        <p className="text-gray-700 font-medium text-lg truncate">{product.name}</p>

        <div className="flex items-center gap-0.5 mb-1">
          {Array(5).fill('').map((_, i) => (
            <img
              key={i}
              className="md:w-3.5 w-3"
              src={i < 4 ? assets.star_icon : assets.star_dull_icon}
              alt=""
            />
          ))}
          <p>(4)</p>
        </div>

        {/* ✅ Variant Selector */}
        <select
          onClick={(e) => e.stopPropagation()}
          value={selectedVariantIndex}
          onChange={(e) => setSelectedVariantIndex(Number(e.target.value))}
          className="border border-gray-300 px-2 py-1 text-sm mb-2 w-fit"
        >
          {product.variants.map((variant, idx) => (
            <option key={idx} value={idx}>
              {variant.weight} {variant.unit} — {variant.offerPrice}₹
            </option>
          ))}
        </select>

        <div className="flex justify-between items-center mt-auto pt-3">
          <span className="text-lg font-semibold text-gray-700">{selectedVariant.offerPrice}₹</span>

          <div
            onClick={(e) => { e.stopPropagation(); }}
            className="text-primary"
          >
            {!cartItems[cartKey] ? (
              <button
                className="flex items-center justify-center gap-1 bg-primary/10 border border-primary/40 md:w-[80px] w-[64px] h-[34px] rounded"
                onClick={() => addToCart(cartKey)}
              >
                <img src={assets.cart_icon} alt="cart_icon" />
                Add
              </button>
            ) : (
              <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-primary/25 rounded select-none">
                <button
                  onClick={() => removeFromCart(cartKey)}
                  className="cursor-pointer text-md px-2 h-full"
                >
                  -
                </button>
                <span className="w-5 text-center">{cartItems[cartKey]}</span>
                <button
                  onClick={() => addToCart(cartKey)}
                  className="cursor-pointer text-md px-2 h-full"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
