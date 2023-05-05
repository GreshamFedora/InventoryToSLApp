import { useState, useEffect } from "react";
const api_base = "http://localhost:3001";

function App() {
    const [inventory, setInventory] = useState([]);
    const [newItem, setNewItem] = useState("");
    const [newQty, setNewQty] = useState("");
    const [newUnits, setNewUnits] = useState("");
    const [newLocation, setNewLocation] = useState("");
    const [newExpires, setNewExpires] = useState("");

    useEffect(() => {
        GetInventory();        
    }, [])

    const GetInventory = () => {
        fetch(api_base + "/inventory")
            .then(res => res.json())
            .then(data => setInventory(data))
            //上一行之數據嗎
            .then(console.log(inventory))
            .catch(err => console.error("Error: ", err));
    }
    
    const addInventoryItem = async ()  => {
        const data = await fetch(api_base + "/inventory/new", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                item: newItem,
                quantity: newQty,
                units: newUnits,
                location: newLocation,
                expires: newExpires
            })
        }).then(res => res.json());

        setInventory([...inventory, data])
        setNewItem("");
        setNewQty("");
        setNewUnits("");
        setNewLocation("");
        setNewExpires("");
    }
    
    const deleteInventoryItem = async (e, id) => {
        const data = await fetch(api_base + '/inventory/delete/' + id, {
            method: "DELETE"
        }).then(res => res.json());

        setInventory(inventory => inventory.filter(item => item._id !== data.result._id))
        e.stopPropagation();
    }

    const completeInventoryItem = async (id) => {
        const data = await fetch(api_base + "/inventory/complete/" + id)
            .then(res => res.json());

            setInventory(inventory => inventory.map(item => {
                if(item._id === data._id) {
                    item.complete = data.complete;
                }

                return item;
            }));
    }

	return (
        <div className="App app-container">
            <h1>Welcome</h1>
            <h4>Inventory</h4>

            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Units</th>
                        <th>Location</th>
                        <th>Expires</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {inventory.length > 0 ? inventory.map(item => (
                        <tr key={item._id}>
                            <td>{item.item}</td>
                            <td>{item.quantity}</td>
                            <td>{item.units}</td>
                            <td>{item.location}</td>
                            <td>{item.expires}</td>
                            <td>
                                <div className="checkbox" onClick={() => completeInventoryItem(item._id)}></div>
                                <div className="delete-item" onClick={(e) => deleteInventoryItem(e, item._id)}>x</div>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="6">You currently have no items in inventory</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <h3>Add Item to Inventory</h3>
<form onSubmit={addInventoryItem}>            
    <input type="text" placeholder="Item" value={newItem} onChange={e => setNewItem(e.target.value)} />
    <input type="text" placeholder="Qty" value={newQty} onChange={e => setNewQty(e.target.value)} />
    <input type="text" placeholder="Units" value={newUnits} onChange={e => setNewUnits(e.target.value)} />
    <select value={newLocation} onChange={(e) => setNewLocation(e.target.value)}>
        <option value="Pantry">Pantry</option>
        <option value="Refrigerator">Refrigerator</option>
        <option value="Cabinet">Cabinet</option>
    </select>
    <input type="text" placeholder="Expires" value={newExpires} onChange={e => setNewExpires(e.target.value)} />
    <button type="submit">Add Item</button>
</form>

                    

		</div>
	);
}

export default App;

