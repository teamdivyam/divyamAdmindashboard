docker run -d \
  --name mongodb \
  --network mongo-net \
  -e MONGODB_REPLICA_SET_MODE=primary \
  -e MONGODB_REPLICA_SET_NAME=rs0 \
  -e MONGODB_ADVERTISED_HOSTNAME=mongodb \
  -e MONGODB_ROOT_USER=divyammain \
  -e MONGODB_ROOT_PASSWORD=D3R2SXLs3L5Mn4Yi \
  -e MONGODB_REPLICA_SET_KEY=XK2p2amK04fmaZrD \
  -v mongodb_data:/bitnami/mongodb \
  -p 27017:27017 \
   --restart unless-stopped \
  bitnami/mongodb

telnet 10.0.1.184 27017



  rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "10.0.1.134:27017" }
  ]
})


DB_URL=mongodb://divyammain:D3R2SXLs3L5Mn46i@10.0.1.134/divyamdb?replicaSet=rs0

docker exec -it mongodb mongo -u divyammain -p D3R2SXLs3L5Mn4Yi --authenticationDatabase admin


mongosh -u divyammain --authenticationDatabase admin --host localhost --port 27017


mongo --host <MongoDB-private-IP> --port 27017 -u <MongoDB-username> -p <MongoDB-password> --authenticationDatabase admin


nc -zv 10.0.1.184 27017




docker run -it -d \
    --network mongo-net \
    --name mongo-express \
    -p 8081:8081 \
    -e ME_CONFIG_OPTIONS_EDITORTHEME="material" \
    -e ME_CONFIG_MONGODB_SERVER="mongodb" \
    -e ME_CONFIG_BASICAUTH_USERNAME="divyam_db" \
    -e ME_CONFIG_BASICAUTH_PASSWORD="0gNcygJrdDlt81Th" \
    -e ME_CONFIG_MONGODB_ADMINUSERNAME="divyammain" \
    -e ME_CONFIG_MONGODB_ADMINPASSWORD="D3R2SXLs3L5Mn4Yi" \
    mongo-express
