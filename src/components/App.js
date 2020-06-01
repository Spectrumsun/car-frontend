import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import filterIcon from "../asset/filter.svg";
import carSvg from "../asset/car.jpeg";

const App = () => {
  const [data, setData] = useState([]);
  const [filterList, setFilterList] = useState({
    start_year: "",
    end_year: "",
    gender: "",
    colors: [],
    countries: [],
  });
  const [result, setResult] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const url =
        "https://cors-anywhere.herokuapp.com/https://ven10.co/assessment/filter.json";
      const response = await axios.get(url);
      setData(response.data);
    };
    fetchData();
  }, []);

  const updateList = async (e, carFilters, type) => {
    const { innerText, id, classList } = e.target;
    const searchList = {
      start_year: carFilters.start_year,
      end_year: carFilters.end_year,
      gender:
        carFilters.gender.charAt(0).toUpperCase() + carFilters.gender.slice(1),
      countries: [...filterList.countries],
      colors: [...filterList.colors],
    };

    innerText && classList.toggle("car_country_active");
    searchList.colors.includes(id)
      ? e.target.setAttribute("stroke", id)
      : e.target.setAttribute("stroke", "black");

    const itemSelected = innerText || id;
    if (!filterList[type].includes(itemSelected)) {
      setFilterList({
        ...searchList,
        [type]: [...filterList[type], itemSelected],
      });
    } else {
      const removeItem = filterList[type].filter(
        (defaultColor) => defaultColor !== itemSelected
      );
      setFilterList({
        ...searchList,
        [type]: [...removeItem],
      });
    }
    try {
      const sendFilter = await axios.get(
        `https://backend-car.herokuapp.com/api/v1/search?start=${searchList.start_year}&end=${searchList.end_year}&gender=${searchList.gender}&countries=${innerText}&color=${id}`
      );
      setResult(sendFilter.data.carResults);
      setOpenModal(true);
      classList.toggle("car_country_active");
      e.target.removeAttribute("stroke");
      document.body.style["overflow-y"] = "hidden";
    } catch (error) {
      console.log(error);
    }
  };

  const countryList = (country, key, carFilters) => (
    <li key={key}>
      <a onClick={(e) => updateList(e, carFilters, "countries")} href="!#">
        {country}
      </a>
    </li>
  );

  const colors = (color, key, carFilters) => (
    <div>
      <svg
        height="100"
        width="100"
        key={key}
        onClick={(e) => updateList(e, carFilters, "colors")}
      >
        <circle
          cx="50"
          cy="50"
          r="20"
          id={color}
          strokeWidth="5"
          fill={color}
        />
      </svg>
    </div>
  );

  const details = (carFilters) => (
    <>
      <div className="filter_box" key={carFilters.id}>
        <p className="filter_year">
          {carFilters.start_year} - {carFilters.end_year}
        </p>
        <p>{carFilters.gender}</p>
        <div className="car_country_list">
          <ul
            style={{
              gridTemplateColumns: `repeat(${carFilters.countries.length}, auto)`,
            }}
          >
            {carFilters.countries.map((country, key) =>
              countryList(country, key, carFilters)
            )}
          </ul>
        </div>
        <div
          className="car_color"
          style={{
            gridTemplateColumns: `repeat(${carFilters.colors.length}, auto)`,
          }}
        >
          {carFilters.colors.map((color, key) =>
            colors(color, key, carFilters)
          )}
        </div>
      </div>
    </>
  );

  const carFilters = (car) => (
    <div className="car_filter_container">
      <img src={carSvg} alt="car" className="car_svg" />
      <div>
        <p className="car_filter_name">
          {car.first_name} {car.last_name}
        </p>
        <ul>
          <li>Brand</li>
          <li>Year</li>
          <li>Color</li>
        </ul>
        <ul className="car_filter_details">
          <li>{car.car_model}</li>
          <li>{car.car_model_year}</li>
          <li
            className="car_circle_color"
            style={{ background: car.car_color }}
          >
            {car.car_color}
          </li>
        </ul>
        <ul>
          <li>Country</li>
          <li>Gender</li>
          <li>Job</li>
        </ul>
        <ul>
          <li>{car.country}</li>
          <li>{car.gender}</li>
          <li>{car.job_title}</li>
        </ul>
        <p>
          Email: <spam className="car_filter_details">{car.email}</spam>
        </p>
        <p>
          Bio: <span className="car_filter_details"> {car.bio}</span>
        </p>
      </div>
    </div>
  );

  const carResult = (cars) =>
    console.log(cars.length) || cars.length === 0 ? (
      <div className="car_filter_no_result">
        <h3>No result for the search</h3>
      </div>
    ) : (
      cars.map((car) => carFilters(car))
    );

  const modal = (result) => (
    <div id="modal" class="modal-window" onClick={closeModal}>
      <div class="modal-content">{carResult(result)}</div>
    </div>
  );

  const closeModal = () => {
    setOpenModal(false);
    document.body.style["overflow-y"] = "";
  };

  return (
    <>
      <nav className="nav_bar">Cars</nav>
      <div className="container">
        <section>
          <div className="filter_icon">
            <img src={filterIcon} alt="Filter" />
            <h3>Filter</h3>
          </div>
          {data.map((carFilters) => details(carFilters))}
        </section>
        {openModal ? modal(result) : null}
      </div>
    </>
  );
};

export default App;
