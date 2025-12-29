
async function main() {
    const id = '877';
    const url = `https://www.jreast.co.jp/estation/stations/${id}.html`;
    try {
        const res = await fetch(url);
        if (res.ok) {
            const html = await res.text();
            // simple check
            if (html.includes('新橋') || html.includes('Shimbashi')) {
                console.log(`✅ ID ${id} is Shimbashi!`);
            } else {
                console.log(`❌ ID ${id} valid but not Shimbashi?`);
                console.log(html.slice(0, 500));
            }
        } else {
            console.log(`❌ ID ${id} status: ${res.status}`);
        }
    } catch (e) {
        console.error(e);
    }
}
main();
