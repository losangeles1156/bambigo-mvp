
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

async function checkOperators() {
    const query = `
        [out:json][timeout:25];
        area["name:en"="Minato"]["admin_level"="7"]->.searchArea;
        (
            node["railway"="station"](area.searchArea);
        );
        out body;
    `;

    try {
        const response = await fetch(OVERPASS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `data=${encodeURIComponent(query)}`
        });
        const data = await response.json();
        const operators = new Set();
        data.elements.forEach((el: any) => {
            if (el.tags.operator) {
                operators.add(el.tags.operator);
            } else {
                operators.add('undefined');
            }
        });
        console.log('Operators found in Minato:', Array.from(operators));
    } catch (e) {
        console.error(e);
    }
}

checkOperators();
