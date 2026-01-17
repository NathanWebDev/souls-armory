import { Card } from "@/components/ui/card";

export default function ItemTile(){
    return(
        <>
            <Card className="p-4 m-4 w-150px flex flex-col sm:flex-row items-center">
                <img src="https://upload.wikimedia.org/wikipedia/commons/d/dd/Square_-_black_simple.svg" alt="Item Image" style={{width: "64px", aspectRatio: "1/1", objectFit: "cover"}}/>
                <p>This is an item tile component.</p>
            </Card>
        </>
    )
}