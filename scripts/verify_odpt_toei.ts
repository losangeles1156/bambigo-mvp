
async function test() {
    const urls = [
        'https://api-public.odpt.org/api/v4/odpt:BusstopPole?odpt:operator=odpt.Operator:Toei',
        'https://api-public.odpt.org/api/v4/odpt:Railway?odpt:operator=odpt.Operator:Toei'
    ];

    for (const url of urls) {
        console.log(`Testing: ${url}`);
        try {
            const res = await fetch(url);
            console.log(`Status: ${res.status}`);
            const data = await res.json();
            console.log(`Length: ${Array.isArray(data) ? data.length : 'Not an array'}`);
            if (Array.isArray(data) && data.length > 0) {
                console.log('Sample:', data[0]['owl:sameAs']);
            }
        } catch (e: any) {
            console.error(`Error: ${e.message}`);
        }
    }
}

test();
