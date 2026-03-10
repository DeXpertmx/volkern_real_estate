import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config({ path: '.env.local' });

async function run() {
    try {
        const response = await axios.get(`${process.env.VOLKERN_MCP_URL}/catalogo?limit=1`, {
            headers: { 'Authorization': `Bearer ${process.env.VOLKERN_MCP_API_KEY}` }
        });
        console.log(JSON.stringify(response.data.items[0], null, 2));
    } catch (e) {
        console.error(e.response ? e.response.data : e.message);
    }
}
run();
