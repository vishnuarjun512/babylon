import { motion, AnimatePresence } from "framer-motion";
import { useModel } from "../states/useModel";
import { useState, memo } from "react";

interface ConfiguratorProps {}

const Configurator: React.FC<ConfiguratorProps> = () => {
  const { setWidth, width, setLayout, height, setHeight } = useModel();

  // State to track which categories are open
  const [openCategories, setOpenCategories] = useState<
    Record<"Width" | "Height" | "Color", boolean>
  >({
    Width: false,
    Height: false,
    Color: false,
  });

  // Toggle category function
  const toggleCategory = (category: "Width" | "Height" | "Color") => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category], // Toggle the clicked category
    }));
  };

  const Layouts = memo(() => {
    const layouts = ["Left", "Middle", "Right"];

    return (
      <div className="flex gap-2 items-center justify-center">
        {layouts.map((layout) => (
          <button
            className={`px-3 py-2 rounded-lg`}
            key={layout}
            onClick={() => setLayout(layout)}
          >
            {layout}
          </button>
        ))}
      </div>
    );
  });

  // Size
  const Size = memo(() => {
    const sizes = [1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400];

    return (
      <div className="flex gap-2 items-center justify-center flex-wrap">
        {sizes.map((csize) => (
          <button
            onClick={() => {
              setWidth(csize);
            }}
            className={`${
              width === csize ? "bg-blue-600" : "bg-blue-500"
            }  px-3 py-2 rounded-lg`}
            key={csize}
          >
            {csize}
          </button>
        ))}
      </div>
    );
  });

  const Height = memo(() => {
    return (
      <div className="flex justify-center">
        <div className="flex gap-3">
          {[2100, 2400].map((mheight) => {
            return (
              <button
                className={`px-4 py-2 w-full text-left rounded-lg ${
                  height == mheight ? "bg-blue-600" : "bg-blue-400"
                } hover:bg-blue-500`}
                key={mheight}
                onClick={() => {
                  setHeight(mheight);
                }}
              >
                {mheight}
              </button>
            );
          })}
        </div>
      </div>
    );
  });

  const categories = [
    {
      name: "Height",
      content: <Height />,
    },
    {
      name: "Width",
      content: (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: 1,
            height: "auto",
            transition: { duration: 0.2, ease: "easeInOut" },
          }}
          exit={{ opacity: 0, height: 0 }}
          className="flex gap-2 flex-col justify-center"
        >
          <Layouts />
          <Size />
        </motion.div>
      ),
    },
    {
      name: "Color",
      content: (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="flex justify-center"
        >
          Color component goes here{" "}
        </motion.div>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ ease: "easeInOut" }}
      className="absolute right-5 top-5 w-[400px] flex-wrap"
    >
      {/* Category Buttons */}
      <div className="flex gap-4 flex-col w-full">
        {categories.map((category) => (
          <div key={category.name} className="w-full">
            <button
              onClick={() =>
                toggleCategory(category.name as "Width" | "Height" | "Color")
              }
              className={`transition-all  ease-in-out duration-300 px-4 py-2 w-full text-center text-lg font-semibold rounded-lg ${
                openCategories[category.name as "Width" | "Height" | "Color"]
                  ? "bg-green-400 text-black"
                  : "bg-green-500"
              }`}
            >
              {category.name}
            </button>
            <AnimatePresence>
              {openCategories[
                category.name as "Width" | "Height" | "Color"
              ] && (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                    transition: { duration: 0.2 },
                  }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="w-full mt-2"
                >
                  {category.content}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Configurator;
