import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IMerchItem {
  id: string | number;
  image: string;
  title: string;
  price: string | number;
}

interface IMerchItemsCardProps {
  items: IMerchItem[];
  itemsPerPage: number;
  columns: number; // Number of columns
}

const MerchItemsCard = ({
  items,
  itemsPerPage = 4,
  columns = 4,
}: IMerchItemsCardProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextPage = () => {
    if (currentIndex + itemsPerPage < items.length) {
      setDirection(1);
      setCurrentIndex(currentIndex + itemsPerPage);
    }
  };

  const prevPage = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(currentIndex - itemsPerPage);
    }
  };

  const columnWidth = `${100 / columns}%`;

  return (
    <div className="w-3/4 mx-auto p-4">
      <div className="bg-gray-100 rounded-sm shadow-md p-4">
        <div className="overflow-hidden relative">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              initial={{
                x: direction > 0 ? 300 : -300,
                opacity: 0,
                position: "absolute",
              }}
              animate={{
                x: 0,
                opacity: 1,
                position: "relative",
              }}
              exit={{
                x: direction > 0 ? -300 : 300,
                opacity: 0,
                position: "absolute",
              }}
              transition={{ duration: 0.5 }}
              className="flex  gap-4"
            >
              {items
                .slice(currentIndex, currentIndex + itemsPerPage)
                .map((product) => (
                  <div
                    key={product.id}
                    style={{ flexBasis: columnWidth }}
                    className="p-2"
                  >
                    <MerchItem {...product} />
                  </div>
                ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="flex justify-center items-center mt-4 space-x-4">
        <button
          onClick={prevPage}
          disabled={currentIndex === 0}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded disabled:opacity-50"
        >
          &lt;
        </button>
        <p className="text-gray-700">
          {currentIndex / itemsPerPage + 1} /{" "}
          {Math.ceil(items.length / itemsPerPage)}
        </p>
        <button
          onClick={nextPage}
          disabled={currentIndex + itemsPerPage >= items.length}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded disabled:opacity-50"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

const MerchItem = ({ image, title, price }: IMerchItem) => (
  <div className="text-start ">
    <img
      src={image}
      alt={title}
      className="w-full h-auto object-contain mb-2 rounded-sm"
    />
    <div className="ms-2">
      <h3 className="text-lg md:text-2xl font-semibold">{title}</h3>
      <p className="text-gray-600">SYNCYRLEY</p>
      <p className="text-xl font-bold">{price} €</p>
    </div>
  </div>
);

export default MerchItemsCard;
