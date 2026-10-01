import { getOffer, getOffers } from './offers.service.js';
export async function listOffersController(filters) { return getOffers(filters); }
export async function getOfferController(id) { return getOffer(id); }
