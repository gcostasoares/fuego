import { useState } from "react";
import styled from "styled-components";
import { Separator } from "./ui/separator";
import apiClient from "@/Apis/apiService";

export const RegistrationBoxSection = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await apiClient.post("/NewsLetter/Add", {
        email,
      });

      if (response.status === 200) {
        setSuccess(true);
        setEmail("");
      }
    } catch (err) {
      console.error("Error submitting email:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper className="relative flex justify-center items-center">
      <div className="container justify-items-center">
        <RegisterContainer>
          <p className="font-extrabold mb-6 text-2xl md:text-4xl lg:text-5xl tracking-normal">
            Lorem Ipsum Dolor Sit <br />
            Amet, Consectetur
          </p>
          <p className="text-gray-400">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
          <Separator className="my-10 bg-gray-400" />
          <Form onSubmit={handleSubmit}>
            <Input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </Form>
          {success && (
            <p className="text-green-500 mt-4">Successfully added!</p>
          )}
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </RegisterContainer>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  background: linear-gradient(to bottom, white 50%, #2d2d2d 50%);
`;

const RegisterContainer = styled.div`
  background-color: #043f2e;
  color: white;
  padding: 3rem;
  border-radius: 15px;
  text-align: left;
  position: relative;
  max-width: 1100px;
  width: 100%;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);

  /* Tablet View */
  @media (max-width: 992px) {
    max-width: 800px;
    padding: 2.5rem;
  }

  /* Mobile View */
  @media (max-width: 768px) {
    max-width: 600px;
    padding: 2rem;
  }

  /* Extra-small View */
  @media (max-width: 576px) {
    max-width: 90%;
    padding: 1.5rem;
    border-radius: 10px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: start;
  gap: 1.5rem;

  /* Mobile View */
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem; /* Default for large screens */
  border-radius: 30px;
  border: 1px solid #b0c4c2;
  background-color: #043f2e;
  color: white;
  font-size: 1rem;

  &::placeholder {
    color: #b0c4c2;
    padding-left: 10px;
  }

  /* Mobile View */
  @media (max-width: 576px) {
    padding: 0.8rem;
    font-size: 0.9rem;
  }
`;

const Button = styled.button`
  background-color: #3ab54a;
  color: white;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2d8f3a;
  }

  /* Mobile View */
  @media (max-width: 576px) {
    width: 100%;
    padding: 0.8rem;
    font-size: 0.9rem;
  }
`;
