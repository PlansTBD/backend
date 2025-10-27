export const eventbriteService = {
  search: async (types, mood) => {
    // TODO: chiamata API Foursquare
    return [
      {
        id: "fs-1",
        title: "Romantic Rooftop Bar",
        type: "bar",
        description: "Perfect for a date night",
        lat: 45.465,
        lng: 9.19,
        image: "/img/bar1.jpg"
      }
    ];
  }
};
