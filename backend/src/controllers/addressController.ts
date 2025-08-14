import { Request, Response, NextFunction } from 'express';
import {
  createAddress,
  deleteAddressByIdAndUserId,
  getAddressByIdAndUserId,
  getAddressesByUserId,
  unsetDefaultAddresses,
  updateAddressByIdAndUserId,
} from '../models/addressModel';
import { ApiError } from '../utils/ApiError';

// CREATE address
export const createAddressController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req as Request & { user: { id: number } };
    const userId = user.id;

    const {
      full_name,
      phone,
      street_address,
      city,
      province,
      postal_code,
      country = 'Philippines',
      is_default = false,
    } = req.body;

    if (
      !full_name ||
      !phone ||
      !street_address ||
      !city ||
      !province ||
      !postal_code
    ) {
      throw new ApiError('Please fill all required fields.', 400);
    }

    const existing = await getAddressesByUserId(userId);

    let finalIsDefault = is_default;

    if (existing.length === 0) {
      // First address always becomes default
      finalIsDefault = true;
    } else if (is_default) {
      // If making this one default, unset the current default
      await unsetDefaultAddresses(userId);
    }

    const address = await createAddress({
      user_id: userId,
      full_name,
      phone,
      street_address,
      city,
      province,
      postal_code,
      country,
      is_default: finalIsDefault,
    });

    res.status(201).json({ message: 'Address created successfully', address });
  } catch (error) {
    next(error);
  }
};

// READ all addresses for user
export const getAddressesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req as Request & { user: { id: number } };
    const userId = user.id;

    const addresses = await getAddressesByUserId(userId);

    // Convert is_default from 0/1 to boolean
    const convertedAddresses = addresses.map((address) => ({
      ...address,
      is_default: Boolean(address.is_default),
    }));

    res.status(200).json({ addresses: convertedAddresses });
  } catch (error) {
    next(error);
  }
};

// READ single address
export const getAddressByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req as Request & { user: { id: number } };
    const userId = user.id;

    const { id } = req.params;

    const address = await getAddressByIdAndUserId(Number(id), userId);

    if (!address) {
      throw new ApiError('Address not found', 404);
    }

    res.status(200).json({ address });
  } catch (error) {
    next(error);
  }
};

// UPDATE address
export const updateAddressController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req as Request & { user: { id: number } };
    const userId = user.id;

    const { id } = req.params;

    if (req.body.is_default) {
      await unsetDefaultAddresses(userId, Number(id));
    }

    const updated = await updateAddressByIdAndUserId(
      Number(id),
      userId,
      req.body
    );

    if (!updated) {
      throw new ApiError('Address not found or not yours', 404);
    }

    res.status(200).json({ message: 'Address updated successfully' });
  } catch (error) {
    next(error);
  }
};

// DELETE address
export const deleteAddressController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req as Request & { user: { id: number } };
    const userId = user.id;

    const { id } = req.params;

    const deleted = await deleteAddressByIdAndUserId(Number(id), userId);

    if (!deleted) {
      throw new ApiError('Address not found or not yours', 404);
    }

    res.status(200).json({ message: 'Address deleted successfully' });
  } catch (error) {
    next(error);
  }
};
