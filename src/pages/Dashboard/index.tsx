import React, { useEffect, useState } from "react";

import { Food } from "../../components/Food";
import { Header } from "../../components/Header";
import { ModalAddFood } from "../../components/ModalAddFood";
import { ModalEditFood } from "../../components/ModalEditFood";
import { api } from "../../services/api";
import { IFood } from "../../types";

import { FoodsContainer } from "./styles";

export function Dashboard() {
  const [foods, setFoods] = useState<IFood[]>([]);
  const [editingFood, setEditingFood] = useState<IFood>({} as IFood);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadFoods() {
      const { data: foods } = await api.get<IFood[]>("/foods");
      setFoods(foods);
    }

    loadFoods();
  }, []);

  async function handleAddFood(food: IFood) {
    try {
      const { data: newFood } = await api.post<IFood>("/foods", {
        ...food,
        available: true,
      });

      setFoods([...foods, newFood]);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleUpdateFood(food: IFood) {
    try {
      const { data: foodUpdated } = await api.put<IFood>(
        `/foods/${editingFood.id}`,
        {
          ...editingFood,
          ...food,
        }
      );

      const foodsUpdated = foods.map((food) =>
        food.id !== foodUpdated.id ? food : foodUpdated
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(foodId: number) {
    await api.delete(`/foods/${foodId}`);
    const foodsFiltered = foods.filter((food) => food.id !== foodId);

    setFoods(foodsFiltered);
  }

  function handleEditFood(food: IFood) {
    setEditingFood(food);
    setEditModalOpen(true);
  }

  function toggleModal() {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal() {
    setEditModalOpen(!editModalOpen);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}
