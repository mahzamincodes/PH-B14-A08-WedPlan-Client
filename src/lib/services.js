
const API_BASE_URL = (
    process.env.BACKEND_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

export const SERVICE_DATA_STATUS = {
    OK: "ok",
    ERROR: "error",
    UNAVAILABLE: "unavailable",
};

function normalizeService(item) {
    const price = Number(item.price);
    const categoryName = item.category || "";

    return {
        id: item._id || item.id,
        name: item.serviceName || "Wedding service",

        category: categoryName
            ? {
                  name: categoryName,
                  slug: categoryName
                      .toLowerCase()
                      .trim()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/^-|-$/g, ""),
              }
            : null,

        price: Number.isFinite(price)
            ? {
                  amount: price,
                  currency: "BDT",
              }
            : null,

        priceLabel: Number.isFinite(price)
            ? `৳${price.toLocaleString("en-BD")}`
            : null,

        location: item.location || null,

        vendor: item.vendor
            ? {
                  name: item.vendor.name || null,
                  image: item.vendor.image || null,
              }
            : null,

        image: item.images?.[0] || null,
    };
}

async function fetchServices(params = {}) {
    try {
        const query = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                query.set(key, value);
            }
        });

        const queryString = query.toString();
        const url = `${API_BASE_URL}/api/services${
            queryString ? `?${queryString}` : ""
        }`;

        const response = await fetch(url, {
            cache: "no-store",
        });

        if (!response.ok) {
            throw new Error(`Services API failed: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success || !Array.isArray(data.services)) {
            throw new Error("Invalid services API response.");
        }

        return {
            services: data.services.map(normalizeService),
            status: SERVICE_DATA_STATUS.OK,
        };
    } catch (error) {
        console.error("Services fetch failed:", error);

        return {
            services: [],
            status: SERVICE_DATA_STATUS.ERROR,
        };
    }
}

/**
 * Fetches the latest six services for the home page.
 */
export async function getFeaturedServices() {
    return fetchServices({ limit: 6 });
}

/**
 * Fetches approved services for the browse services page.
 *
 * @param {{ search?: string, category?: string, location?: string, sort?: string }} filters
 */
export async function getBrowseServices(filters = {}) {
    return fetchServices({
        search: filters.search,
        category: filters.category,
        location: filters.location,
        sort: filters.sort,
    });
}
