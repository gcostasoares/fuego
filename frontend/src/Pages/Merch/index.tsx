import MerchItemsCard from "./items-card";

const products = [
  {
    id: 1,
    title: "stars shirt",
    price: "€40,00",
    image: "/images/merchItems/merch.png",
  },
  {
    id: 2,
    title: "alien shirt",
    price: "€40,00",
    image: "/images/merchItems/merch.png",
  },
  {
    id: 3,
    title: "架空のものです",
    price: "€50,00",
    image: "/images/merchItems/merch.png",
  },
  {
    id: 4,
    title: "missing shirt",
    price: "€40,00",
    image: "/images/merchItems/merch.png",
  },
  {
    id: 5,
    title: "extra shirt",
    price: "€30,00",
    image: "/images/merchItems/merch.png",
  },
  {
    id: 6,
    title: "new shirt",
    price: "€35,00",
    image: "/images/merchItems/merch.png",
  },
];

const Merch = () => {
  return (
    <div className="justify-center w-full">
      <div className="p-4 w-3/4 mx-auto">
        <img
          src="https://placehold.co/600x400"
          alt=""
          className="w-full h-20 object-cover"
        />
      </div>
      <MerchItemsCard items={products} itemsPerPage={2} columns={2} />

      <div className="w-3/4 mx-auto p-4  ">
        <div className="p-4 bg-gray-100 rounded-sm  shadow-sm">
          <div className="row overflow-hidden relative h-full">
            <p className="col-4 text-7xl font-bold">Syncyrley x Fuego</p>
            <img
              className="col-8 object-contain h-96"
              src="/images/home/tiger_transparent.png"
            />
          </div>
          <div className="flex-col space-y-2">
            <h4 className="text-2xl font-bold">
              Eine Symbiose fur Mensch und Natur
            </h4>
            <h6>
              syncyrley steht für künstlerische Freiheit und höchste Qualität in
              der Modewelt. Die Marke verbindet Kreativitat mit einem tiefen
              Bewusstsein für Umwelt und Fairtrade. Jedes Kleidungsstück
              spiegelt eine harmonische Balance aus Ästhetik, Handwerkskunst und
              nachhaltiger Verantwortung wider.
            </h6>
            <p>
              Die Partnerschaft mit Fuego bringt diese Philosophie auf eine neue
              Ebene. Fuego, bekannt für seine Leidenschaft und Energie, erganzt
              syncyrleys künstlerischen Ansatz durch innovative und
              transformative Elemente. Gemeinsam schaffen sie eine nahtlose
              Verbindung zweier Visionen, die einander inspirieren und
              verstärken.
            </p>
            <p>
              Das Ergebnis: Eine Kollektion, die nicht nur optisch beeindruckt,
              sondern auch einen positiven Beitrag für Mensch und Natur leistet.
              Diese Zusammenarbeit setzt ein starkes Zeichen für nachhaltige
              Eleganz und die Schönheit gemeinschaftlicher Kreativität.
            </p>
          </div>
        </div>
      </div>

      <MerchItemsCard items={products} itemsPerPage={4} columns={4} />
      <MerchItemsCard items={products} itemsPerPage={2} columns={2} />
    </div>
  );
};

export default Merch;
