// import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";

// Styled Components
const FilterSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  border-radius: 10px;
  margin: 20px auto;
`;

const FilterTag = styled.div`
  display: flex;
  align-items: center;
  background-color: #fff;
  border: 1px solid #d1d1d4;
  border-radius: 50px;
  padding: 5px 15px;
  font-size: 0.9rem;
  color: #4c4c4c;
  cursor: pointer;
  font-weight: 500;
  height: 43px;

  span {
    margin-left: 10px;
    color: #ff4c4c;
    font-weight: bold;
    cursor: pointer;
  }

  &:hover {
    border-color: #6a679e;
  }
`;

const SearchInputWrapper = styled.div`
  position: relative;
  flex: 1;
  padding: 10px 15px;
  margin: 0 20px;
  border: 1px solid #d1d1d4;
  border-radius: 50px;
  font-size: 0.9rem;
  outline: none;
  font-weight: 500;
  height: 43px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0px 12px 10px 20px;
  border: none;
  background: transparent;
  font-size: 0.9rem;
  outline: none;
  font-weight: 500;

  &:focus {
    border-color: #6a679e;
  }
`;

const SearchIcon = styled.svg`
  position: absolute;
  left: 10px; /* Position the icon inside the input */
  top: 50%;
  transform: translateY(-50%);
  fill: #6a679e; /* Icon color */
`;

// React Functional Component
export default function FilterBarSection() {
  return (
    <FilterSection>
      {/* Filter Tag */}
      <FilterTag>
        Genetik: Hybrid (Sativa-dominant) <span>✕</span>
      </FilterTag>

      {/* Search Input */}
      <SearchInputWrapper>
        <SearchIcon width="16" height="16" viewBox="0 0 24 24">
          <path d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8c1.38 0 2.66-.4 3.73-1.08l5.29 5.29 1.41-1.41-5.29-5.29C17.66 15.66 18 14.38 18 13c0-5.42-4.58-10-10-10zm0 14c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
        </SearchIcon>
        <SearchInput
          type="text"
          placeholder="Suche nach Namen, Strains oder Terpenen"
        />
      </SearchInputWrapper>

      {/* Bootstrap Dropdown */}
      <div className="dropdown">
        <button
          className="btn btn-light dropdown-toggle"
          type="button"
          id="dropdownMenuButton"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          SORTIERUNG: VERFÜGBAR
        </button>
        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <li>
            <a className="dropdown-item" href="#">
              Verfügbar
            </a>
          </li>
          <li>
            <a className="dropdown-item" href="#">
              Neueste
            </a>
          </li>
          <li>
            <a className="dropdown-item" href="#">
              Beliebtheit
            </a>
          </li>
        </ul>
      </div>
    </FilterSection>
  );
}
