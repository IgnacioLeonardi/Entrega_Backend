import { cartsManager } from "../dao/mongodb/mongodb.js";

export async function getCartsController(req, res) {
  let limit = req.query.limit;
  const data = await cartsManager.find();
  try {
    if (!limit) {
      return res.json(data);
    }
    let limitedCarts = data.slice(0, limit);
    return res.json(limitedCarts);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
}

export async function getCartByIdController(req, res) {
  const { cid } = req.params;
  try {
    const cartForId = await cartsManager.findById(cid);
    return res.json({ cartForId });
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
}

export async function postAddProductToCartController(req, res) {
  const { cid, pid } = req.params;
  try {
    await cartsManager.create(cid, pid);
    return res.send(cid);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
}

export async function postCartController(req, res) {
  try {
    await cartsManager.create(req.body);
    res.json(req.body);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
}

export async function deleteCartController(req, res) {
  const { id } = req.params;
  try {
    await cartsManager.deleteOne(id);
    res.json(req.body);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
}
