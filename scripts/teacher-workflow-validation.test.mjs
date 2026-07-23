import assert from "node:assert/strict";
import test from "node:test";
import { validateTeacherSignup, validateMedia, validateProfile } from "../src/lib/validations.ts";
import { buildContributorProfile } from "../src/lib/auth-profile.ts";

test("teacher signup requires a complete valid profile", () => {
  assert.equal(validateTeacherSignup({
    name: "Siti Aminah",
    madrasah: "MTs Negeri 1",
    teaching_subject: "Matematika",
    phone: "+62 812-3456-7890",
    email: "siti@example.com",
    password: "belajar123",
  }).valid, true);
  assert.equal(validateTeacherSignup({
    name: "Siti",
    madrasah: "",
    teaching_subject: "IPA",
    phone: "abc",
    email: "invalid",
    password: "short",
  }).valid, false);
});

test("pending is a valid media review status", () => {
  assert.equal(validateMedia({
    title: "Modul Aljabar",
    slug: "modul-aljabar",
    description: "Materi pembelajaran",
    format: "pdf",
    type: "file",
    status: "pending",
  }).valid, true);
});

test("profile updates reject missing names and invalid phone numbers", () => {
  assert.equal(validateProfile({ name: "Siti Aminah", phone: "+62 812-3456-7890" }).valid, true);
  assert.equal(validateProfile({ name: "", phone: "not-a-number" }).valid, false);
});

test("orphan auth users are restored as contributors", () => {
  assert.deepEqual(buildContributorProfile({
    id: "user-1",
    email: "guru@example.com",
    user_metadata: {},
  }), {
    id: "user-1",
    email: "guru@example.com",
    name: "guru",
    role: "contributor",
    madrasah: null,
    teaching_subject: null,
    phone: null,
  });
});
