import asyncio
from database import AsyncSessionLocal
from models import Subject, Chapter
from database import engine, Base


async def create_tables():
    """A function to create the database tables."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def seed_data():
    print("Starting to seed the database...")
    await create_tables()

    async with AsyncSessionLocal() as session:
        async with session.begin():
            print("Clearing old data...")
            from sqlalchemy import delete

            await session.execute(delete(Chapter))
            await session.execute(delete(Subject))

            print("Adding new data...")

            # --- L1 Subjects ---
            l1_ads = Subject(name="Algorithms and Data Structures", year=1)
            session.add(l1_ads)

            await session.flush()

            l1_ads_ch1 = Chapter(
                title="Introduction to Complexity",
                content="""
## What is Algorithmic Complexity?

It's a measure of how many resources (usually time or memory) an algorithm uses, relative to the size of the input (n).

## Time Complexity

This is the most common type of complexity we analyze. It describes how the runtime of an algorithm grows as the input size grows. We use Big O notation to express this.

### Common Time Complexities
* O(1) - Constant
* O(log n) - Logarithmic
* O(n) - Linear

## Space Complexity

This refers to the amount of memory space an algorithm requires.
""",
                subject_id=l1_ads.id,
            )
            l1_ads_ch2 = Chapter(
                title="Sorting Algorithms",
                content="### Bubble Sort\n\nBubble sort is a simple but inefficient sorting algorithm...",
                subject_id=l1_ads.id,
            )
            l1_ads_ch3 = Chapter(
                title="Performance",
                content="## Performance Challenges\n it goes brrrrr heheheheheheheheh CODE BLOCKS TIME \n```py\nprint('Hello World')\nfor i in range(10):\n    print(i)\n```\n## Importance of caching\n it is what it is lol \n- list one\n- list two",
                subject_id=l1_ads.id,
            )
            session.add_all([l1_ads_ch1, l1_ads_ch2, l1_ads_ch3])

            l3_isil = Subject(
                name="Software Engineering", year=3, specialization="ISIL"
            )
            l3_si = Subject(name="Information Theory", year=3, specialization="SI")
            session.add_all([l3_isil, l3_si])
            await session.flush()

            l3_isil_ch1 = Chapter(
                title="The Software Development Life Cycle (SDLC)",
                content="## Phases of SDLC\n\n1. Requirement Analysis\n2. Design...",
                subject_id=l3_isil.id,
            )
            session.add(l3_isil_ch1)

            await session.commit()

    print("Database seeding completed successfully!")


if __name__ == "__main__":
    asyncio.run(seed_data())
