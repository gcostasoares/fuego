// Example component
function StrainList() {
    const [strains, setStrains] = useState([]);
  
    useEffect(() => {
      const fetchStrains = async () => {
        try {
          const response = await fetch('http://localhost:3001/api/strains');
          const data = await response.json();
          setStrains(data);
        } catch (error) {
          console.error('Error fetching strains:', error);
        }
      };
      
      fetchStrains();
    }, []);
  
    return (
      <div>
        {strains.map(strain => (
          <div key={strain.id}>
            <h3>{strain.name}</h3>
            <p>Type: {strain.type}</p>
          </div>
        ))}
      </div>
    );
  }