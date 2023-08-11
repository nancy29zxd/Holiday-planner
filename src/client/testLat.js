window.onload= getPointsWithinRadius()
getDistanceFromLatLonInKm( 56.43512751968653, -2.9940437955408465, 56.33778, -2.81842);



    function getPointsWithinRadius() {
          const R = 6371; // radius of the Earth in km
          const lat1 = toRadians("56.33963"); //56.33963, long: -2.78847
          const lon1 = toRadians("-2.78847");
          const points = [];
        const radiusKm = 8; //10->8 , 15->12, 20->11
        
         
        
          // calculate the latitudinal distance covered by 10km radius
  const latDist = 2 * Math.asin(Math.sin(radiusKm / (2 * R)) / Math.cos(lat1));
  
  // calculate the longitudinal distance covered by 10km radius
  const lonDist = 2 * Math.asin(Math.sin(radiusKm / (2 * R)) / Math.cos(lat1)) / Math.cos(lat1);

  // calculate the corner coordinates
  const topLeftLat = toDegrees(lat1 + latDist/2);
  const topLeftLon = toDegrees(lon1 - lonDist/2);
  const bottomRightLat = toDegrees(lat1 - latDist/2);
  const bottomRightLon = toDegrees(lon1 + lonDist/2);

   console.log( [[topLeftLat, topLeftLon], [bottomRightLat, bottomRightLon]]);
        
         // console.log( points);
        
        }
        
         
        
        function toRadians(degrees) {
          return degrees * Math.PI / 180;
        }
        
         
        
        function toDegrees(radians) {
          return radians * 180 / Math.PI;
        }

        function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
            const R = 6371; // radius of the Earth in km
            const dLat = toRadians(lat2 - lat1);
            const dLon = toRadians(lon2 - lon1);
            const a =
              Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distance = R * c;

            console.log(distance);
            //return distance;
          }