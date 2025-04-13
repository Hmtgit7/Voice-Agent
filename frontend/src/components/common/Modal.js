// src/components/common/Modal.js
import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'md',
    closeOnOverlayClick = true,
    showCloseButton = true,
    className = '',
    ...props
}) => {
    // Modal size classes
    const sizeClasses = {
        xs: 'max-w-xs',
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
        '4xl': 'max-w-4xl',
        '5xl': 'max-w-5xl',
        full: 'max-w-full',
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-10"
                onClose={closeOnOverlayClick ? onClose : () => { }}
                {...props}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className={`w-full ${sizeClasses[size] || sizeClasses.md} transform overflow-hidden rounded-lg bg-white dark:bg-dark-800 text-left align-middle shadow-xl transition-all ${className}`}>
                                {(title || showCloseButton) && (
                                    <div className="flex justify-between items-center border-b border-gray-200 dark:border-dark-700 px-6 py-4">
                                        {title && (
                                            <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {title}
                                            </Dialog.Title>
                                        )}

                                        {showCloseButton && (
                                            <button
                                                type="button"
                                                className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                                                onClick={onClose}
                                            >
                                                <span className="sr-only">Close</span>
                                                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                            </button>
                                        )}
                                    </div>
                                )}

                                <div className="px-6 py-4">
                                    {children}
                                </div>

                                {footer && (
                                    <div className="border-t border-gray-200 dark:border-dark-700 px-6 py-4">
                                        {footer}
                                    </div>
                                )}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default Modal;