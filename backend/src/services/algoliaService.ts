import dotenv from "dotenv";
import { algoliasearch } from "algoliasearch";

dotenv.config();

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Falta la variable de entorno ${name}`);
  }

  return value;
}

const appId = getRequiredEnv("ALGOLIA_APP_ID");
const writeApiKey = getRequiredEnv("ALGOLIA_WRITE_API_KEY");
const searchApiKey = getRequiredEnv("ALGOLIA_SEARCH_API_KEY");
const indexName = getRequiredEnv("ALGOLIA_INDEX_NAME");

const algoliaWriteClient = algoliasearch(appId, writeApiKey);

const algoliaSearchClient = algoliasearch(appId, searchApiKey);

type PetIndexData = {
  id: number;
  name: string;
  status: "lost" | "found";
  imageUrl: string;
  location: string;
  lat: number;
  lng: number;
};

export async function indexPet(pet: PetIndexData) {
  await algoliaWriteClient.addOrUpdateObject({
    indexName,
    objectID: pet.id.toString(),

    body: {
      name: pet.name,
      status: pet.status,
      imageUrl: pet.imageUrl,
      location: pet.location,

      _geoloc: {
        lat: pet.lat,
        lng: pet.lng,
      },
    },
  });
}

export async function removePetFromIndex(petId: number) {
  await algoliaWriteClient.deleteObject({
    indexName,
    objectID: petId.toString(),
  });
}

export async function searchNearbyPetIds(lat: number, lng: number) {
  const result = await algoliaSearchClient.searchSingleIndex({
    indexName,

    searchParams: {
      query: "",
      aroundLatLng: `${lat}, ${lng}`,
      aroundRadius: 5000,
      hitsPerPage: 20,
    },
  });

  return result.hits
    .map((hit) => Number(hit.objectID))
    .filter((id) => Number.isFinite(id));
}
