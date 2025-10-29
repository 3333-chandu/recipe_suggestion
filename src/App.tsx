import React, { useState } from "react";
import "./index.css";

interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
}

export default function App() {
  const [ingredient, setIngredient] = useState<string>("");
  const [mood, setMood] = useState<string>("");
  const [cookingTime, setCookingTime] = useState<string>("");
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const moodOptions: string[] = [
    "Any mood",
    "Breakfast",
    "Lunch",
    "Dinner",
    "Dessert",
    "Snack",
  ];
  const timeOptions: string[] = ["Any time", "Quick", "Long"];

  const fetchMeals = async (): Promise<void> => {
    if (!ingredient.trim()) {
      setError("Please enter at least one ingredient.");
      return;
    }

    setError("");
    setMeals([]);
    setLoading(true);

    try {
      const ingredients = ingredient
        .split(",")
        .map((i) => i.trim().toLowerCase())
        .filter(Boolean);

      // Fetch meals for each ingredient
      const mealSets = await Promise.all(
        ingredients.map(async (ing) => {
          const res = await fetch(
            `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ing}`
          );
          const data = await res.json();
          return (data.meals as Meal[]) || [];
        })
      );

      if (mealSets.length === 0) {
        setError("No meals found with those ingredients.");
        setLoading(false);
        return;
      }

      // Find intersection (common meals)
      const commonMeals = mealSets.reduce((a, b) =>
        a.filter((mealA) => b.some((mealB) => mealB.idMeal === mealA.idMeal))
      );

      if (!commonMeals.length) {
        setError("No meals found with those ingredients.");
        setLoading(false);
        return;
      }

      // Fetch detailed meal info
      const detailedMeals = await Promise.all(
        commonMeals.map(async (meal) => {
          const res = await fetch(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
          );
          const data = await res.json();
          return data.meals ? (data.meals[0] as Meal) : null;
        })
      );

      let filteredMeals = detailedMeals.filter(
        (meal): meal is Meal => meal !== null
      );

      // 🥗 Mood filter
      if (mood && mood !== "Any mood") {
        const moodMap: Record<string, string[]> = {
          Breakfast: ["Breakfast"],
          Lunch: [
            "Beef",
            "Chicken",
            "Pasta",
            "Seafood",
            "Lamb",
            "Pork",
            "Miscellaneous",
          ],
          Dinner: ["Beef", "Chicken", "Seafood", "Lamb", "Pasta"],
          Dessert: ["Dessert"],
          Snack: ["Side", "Miscellaneous"],
        };

        const validCategories = moodMap[mood] || [];
        filteredMeals = filteredMeals.filter((meal) =>
          validCategories.includes(meal.strCategory)
        );
      }

      // ⏱️ Cooking time filter (mock)
      if (cookingTime === "Quick") {
        filteredMeals = filteredMeals.filter(
          (meal) => meal.strMeal.length < 20
        );
      } else if (cookingTime === "Long") {
        filteredMeals = filteredMeals.filter(
          (meal) => meal.strMeal.length >= 20
        );
      }

      setMeals(filteredMeals);
      setLoading(false);

      if (!filteredMeals.length) {
        setError("No meals found for the selected filters.");
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching meals. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="kitchen-bg">
      <div className="kitchen-content">
        <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">
          🍳 Taylor’s Kitchen Helper
        </h1>
        <p className="mb-6 text-gray-200">
          Enter what ingredients you have, how much time you’ve got, or what
          you’re in the mood for — and find delicious meal ideas!
        </p>

        <div className="flex flex-col gap-4 mb-6">
          <input
            type="text"
            placeholder="Ingredient(s), e.g., chicken, rice, tomato"
            className="kitchen-input"
            value={ingredient}
            onChange={(e) => setIngredient(e.target.value)}
          />

          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="kitchen-input"
          >
            {moodOptions.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <select
            value={cookingTime}
            onChange={(e) => setCookingTime(e.target.value)}
            className="kitchen-input"
          >
            {timeOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <button className="kitchen-button" onClick={fetchMeals}>
            Find Meals
          </button>
        </div>

        {loading && <p className="text-orange-200 mb-4">Fetching meals...</p>}
        {error && <p className="text-red-300 font-semibold mb-4">{error}</p>}

        <div className="grid gap-6 sm:grid-cols-2">
          {meals.map((meal) => (
            <div
              key={meal.idMeal}
              className="bg-white/90 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition transform"
            >
              <img
                src={meal.strMealThumb}
                alt={meal.strMeal}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 text-gray-800">
                <h3 className="font-bold text-lg">{meal.strMeal}</h3>
                <p className="text-sm text-gray-500">{meal.strCategory}</p>
                <a
                  href={`https://www.themealdb.com/meal/${meal.idMeal}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-orange-600 hover:underline mt-2 inline-block"
                >
                  View Recipe →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
