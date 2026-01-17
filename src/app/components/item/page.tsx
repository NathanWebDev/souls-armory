import { Card } from "@/components/ui/card";

export default function ItemTile(){
    return(
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 m-4 mx-15 md:mx-4 lg:mx-4">
                <Card className="flex flex-col md:flex-row items-center min-h-32 md:min-h-auto">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/d/dd/Square_-_black_simple.svg" alt="Item Image" className="w-16 aspect-square object-cover"/>
                    <p>This is an item tile component.</p>
                </Card>
                <Card className="flex flex-col md:flex-row items-center min-h-32 md:min-h-auto">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/d/dd/Square_-_black_simple.svg" alt="Item Image" className="w-16 aspect-square object-cover"/>
                    <p>This is an item tile component.</p>
                </Card>
                <Card className="flex flex-col md:flex-row items-center min-h-32 md:min-h-auto">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/d/dd/Square_-_black_simple.svg" alt="Item Image" className="w-16 aspect-square object-cover"/>
                    <p>This is an item tile component.</p>
                </Card>
            </div>
        </>
    )
}