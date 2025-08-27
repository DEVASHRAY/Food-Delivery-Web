import { AppError } from '../../../lib/app-error.js';
import {
  isValidEmail,
  isValidMobileNumber,
} from '../../../utils/validators.js';

import { Schema, model, InferSchemaType } from 'mongoose';

const RoleString = {
  type: String,
  enum: {
    values: ['USER', 'RESTAURANT_OWNER', 'ADMIN'] as const,
    message: '{VALUE} is not a valid role',
  },
} as const;

const StatusString = {
  type: String,
  enum: {
    values: ['ACTIVE', 'INACTIVE', 'DELETED', 'BLOCKED'] as const,
    message: '{VALUE} is not a valid status',
  },
} as const;

const userSchema = new Schema(
  {
    email: {
      type: String,
      lowercase: true,
      trim: true,
      validate: {
        validator: (email?: string) => email == null || isValidEmail(email),
        message: 'Invalid email address',
      },
    },
    mobile: {
      type: String,
      trim: true,
      validate: {
        validator: (mobile?: string) =>
          mobile == null || isValidMobileNumber(mobile),
        message: 'Invalid Mobile Number',
      },
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    roles: {
      type: [RoleString],
      default: ['USER'],
    },
    status: {
      type: StatusString,
      default: 'ACTIVE',
    },
  },
  {
    timestamps: true,
    collection: 'users',
  }
);

// 👇 Indexes
userSchema.index(
  // index on email field
  { email: 1 },
  // partialFilterExpression is used to ensure that the index is only created for documents that have an email field
  // this is to avoid the index from being created for documents that don't have an email field
  {
    unique: true,
    partialFilterExpression: {
      email: { $exists: true, $nin: [null, ''] },
    },
  }
);

userSchema.index(
  { mobile: 1 },
  {
    unique: true,
    partialFilterExpression: {
      mobile: { $exists: true, $nin: [null, ''] },
    },
  }
);

userSchema.pre('validate', function (next) {
  if (!this.email && !this.mobile) {
    return next(AppError.badRequest('Either email or mobile is required'));
  }
  next();
});

userSchema.pre(
  ['updateOne', 'updateMany', 'findOneAndUpdate'],
  function (next) {
    this.setOptions({ runValidators: true });
    next();
  }
);
