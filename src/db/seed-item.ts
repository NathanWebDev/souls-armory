"use server";

import * as dotenv from 'dotenv';
import { schema } from './schema';
import { db } from './drizzle'

dotenv.config();

async function seed() {
    console.log('Starting Seed');

    try {
        await db.insert(schema.item).values([
            { 
                id: '1', 
                title: 'Dark Moon Greatsword', 
                imgUrl: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/dark_moon_greatsword_weapon_elden_ring_wiki_guide_200px.png',
                type: 'Greatsword' 
            },
            { 
                id: '2', 
                title: 'Giant-Crusher', 
                imgUrl: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/giant-crusher_elden_ring_wiki_guide_200px.png',
                type: 'Colossal Weapon' 
            },
            { 
                id: '3', 
                title: "Bloodhound's Fang", 
                imgUrl: 'https://eldenring.wiki.fextralife.com/file/Elden-Ring/bloodhounds_fang_curved_greatsword_weapon_elden_ring_wiki_guide_200px.png',
                type: 'Curved Greatsword' 
            }
        ])
    } catch (error) {
        console.log('Seeding Failed: ', error);
        process.exit(1);
    }
}

seed();