import { useState, useEffect } from "react";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";
import PropTypes from "prop-types";

function Filters({ onFilterChange }) {
  const [category, setcategory] = useState("");
  const [latest, setLatest] = useState("Latest");
  const [tempcategory, setTempcategory] = useState(category);
  const [tempLatest, setTempLatest] = useState(latest);

  useEffect(() => {
    onFilterChange({ category, latest });
  }, [category, latest, onFilterChange]);

  const applyFilters = () => {
    setcategory(tempcategory);
    setLatest(tempLatest);
  };

  const resetFilters = () => {
    setTempcategory("");
    setTempLatest("Latest");
    setcategory("");
    setLatest("Latest");
  };

  return (
    <div className="flex flex-col space-y-6">
      <h2 className="text-slate-700 text-semibold text-2xl items-center font-bold font-mono">
        Filter
      </h2>
      <div className="flex mx-3 justify-center">
        <div className="w-3/4 px-3 border-gray-100 border-r space-y-6">
          <FormControl fullWidth>
            <InputLabel variant="standard" htmlFor="category-native" shrink>
              Category
            </InputLabel>
            <NativeSelect
              value={tempcategory}
              onChange={(e) => setTempcategory(e.target.value)}
              inputProps={{
                name: "category",
                id: "category-native",
              }}
            >
              <option value="All">All</option>
              <option value="Science">Science</option>
              <option value="History">History</option>
              <option value="Technology">Technology</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Literature">Literature</option>
              <option value="Geography">Geography</option>
              <option value="Sports">Sports</option>
              <option value="Entertainment">Music</option>
              <option value="Art">Art</option>
              <option value="Politics">General Knowledge</option>
            </NativeSelect>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel variant="standard" htmlFor="latest-native">
              Sort by
            </InputLabel>
            <NativeSelect
              value={tempLatest}
              onChange={(e) => setTempLatest(e.target.value)}
              inputProps={{
                name: "latest",
                id: "latest-native",
              }}
            >
              <option value="Latest">Latest</option>
              <option value="Oldest">Oldest</option>
            </NativeSelect>
          </FormControl>

          <div className="flex space-x-4 mt-4 p-2 justify-center">
            <button
              className="bg-blue-900 text-white px-4 py-2 rounded text-md w-fit hover:bg-blue-950"
              onClick={applyFilters}
            >
              Apply
            </button>
            <button
              className="bg-gray-600 hover:bg-gray-800 text-white px-4 py-2 rounded text-md w-fit"
              onClick={resetFilters}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

Filters.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
};

export default Filters;
